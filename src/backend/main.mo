import Set "mo:core/Set";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  /*************** TYPES ***************/
  /********* Users and Profiles ********/
  type UserProfile = {
    username : Text;
    reputation : Nat;
    tier : {
      #bronze;
      #silver;
      #gold;
      #elite;
    };
    totalTrades : Nat;
    winRate : Float;
    pnl : Float;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.username, b.username);
    };

    public func compareByReputation(a : UserProfile, b : UserProfile) : Order.Order {
      Nat.compare(b.reputation, a.reputation);
    };

    public func compareByWinRate(a : UserProfile, b : UserProfile) : Order.Order {
      Float.compare(b.winRate, a.winRate);
    };

    public func compareByPnl(a : UserProfile, b : UserProfile) : Order.Order {
      Float.compare(b.pnl, a.pnl);
    };
  };

  type MarketCategory = {
    #crypto;
    #sports;
    #entertainment;
    #technology;
    #politics;
  };

  module MarketCategory {
    public func toText(category : MarketCategory) : Text {
      switch (category) {
        case (#crypto) { "Crypto" };
        case (#sports) { "Sports" };
        case (#entertainment) { "Entertainment" };
        case (#technology) { "Technology" };
        case (#politics) { "Politics" };
      };
    };
  };

  /* Market outcome prediction, buy/sell, payouts */
  type Market = {
    marketId : Nat;
    question : Text;
    description : Text;
    category : MarketCategory;
    resolutionDate : Time.Time;
    creator : Principal;
    yesPrice : Float;
    noPrice : Float;
    volume : Nat;
    status : {
      #active;
      #resolved;
      #pending;
    };
  };

  module Market {
    public func compareByVolume(a : Market, b : Market) : Order.Order {
      Nat.compare(b.volume, a.volume);
    };

    public func compareByResolutionDate(a : Market, b : Market) : Order.Order {
      Int.compare(b.resolutionDate, a.resolutionDate);
    };

    public func compareById(a : Market, b : Market) : Order.Order {
      Nat.compare(a.marketId, b.marketId);
    };
  };

  type OrderType = {
    #buy;
    #sell;
  };

  type Order = {
    orderId : Nat;
    marketId : Nat;
    orderType : OrderType;
    shareType : {
      #yes;
      #no;
    };
    price : Float;
    quantity : Nat;
    user : Principal;
    timestamp : Time.Time;
  };

  /* Actual deals between buyers and sellers */
  type Trade = {
    tradeId : Nat;
    orderId : Nat;
    marketId : Nat;
    buyer : Principal;
    seller : Principal;
    price : Float;
    quantity : Nat;
    timestamp : Time.Time;
  };

  /* User's share holdings and results */
  type Position = {
    marketId : Nat;
    shareType : {
      #yes;
      #no;
    };
    quantity : Nat;
    avgPrice : Float;
    pnl : Float;
  };

  type Reward = {
    user : Principal;
    earlyPredictor : Nat;
    streak : Nat;
    weeklyChallenge : Nat;
    referrals : Nat;
    totalPoints : Nat;
  };

  module Reward {
    public func compareByTotalPoints(a : Reward, b : Reward) : Order.Order {
      Nat.compare(b.totalPoints, a.totalPoints);
    };
  };

  /*************** STATE ***************/
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let markets = Map.empty<Nat, Market>();
  let orders = Map.empty<Nat, Order>();
  let trades = Map.empty<Nat, Trade>();
  let positions = Map.empty<Principal, Set.Set<Position>>();
  let rewards = Map.empty<Principal, Reward>();
  var marketIdCounter = 0;
  var orderIdCounter = 0;
  var tradeIdCounter = 0;

  /*************** USERS/PROFILES ***************/
  public query ({ caller }) func isUsernameTaken(username : Text) : async Bool {
    userProfiles.values().any(func(profile) { profile.username == username });
  };

  public shared ({ caller }) func createProfile(username : Text) : async () {
    if (username.trim(#char ' ').size() == 0) {
      Runtime.trap("Username cannot be empty");
    };
    if (userProfiles.values().any(func(profile) { profile.username == username })) {
      Runtime.trap("Username already taken");
    };
    let newProfile = {
      username;
      reputation = 0;
      tier = #bronze;
      totalTrades = 0;
      winRate = 0.0;
      pnl = 0.0;
    };
    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getTopUsersByReputation() : async [UserProfile] {
    userProfiles.values().toArray().sort(UserProfile.compareByReputation);
  };

  public query ({ caller }) func getTopUsersByWinRate() : async [UserProfile] {
    userProfiles.values().toArray().sort(UserProfile.compareByWinRate);
  };

  public query ({ caller }) func getTopUsersByPnl() : async [UserProfile] {
    userProfiles.values().toArray().sort(UserProfile.compareByPnl);
  };

  /*************** MARKETS ***************/
  public shared ({ caller }) func createMarket(question : Text, description : Text, category : MarketCategory, resolutionDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create markets");
    };
    marketIdCounter += 1;
    let marketId = marketIdCounter;
    let newMarket = {
      marketId;
      question;
      description;
      category;
      resolutionDate;
      creator = caller;
      yesPrice = 0.5;
      noPrice = 0.5;
      volume = 0;
      status = #active;
    };
    markets.add(marketId, newMarket);
    marketId;
  };

  public query ({ caller }) func getMarket(marketId : Nat) : async Market {
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Market does not exist") };
      case (?market) { market };
    };
  };

  public query ({ caller }) func getAllMarkets() : async [Market] {
    markets.values().toArray().sort(Market.compareById);
  };

  public query ({ caller }) func getActiveMarkets() : async [Market] {
    markets.filter(func(_, market) { market.status == #active }).values().toArray().sort(Market.compareByResolutionDate);
  };

  public query ({ caller }) func getMarketsByCategory(category : MarketCategory) : async [Market] {
    markets.filter(func(_, market) { market.category == category }).values().toArray().sort(Market.compareByVolume);
  };

  public query ({ caller }) func getMarketsByCreator(creator : Principal) : async [Market] {
    markets.filter(func(_, market) { Principal.equal(market.creator, creator) }).values().toArray().sort(Market.compareById);
  };

  /*************** TRADING ***************/
  public shared ({ caller }) func placeOrder(marketId : Nat, orderType : OrderType, shareType : { #yes; #no }, price : Float, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Market does not exist") };
      case (?market) {
        if (market.status != #active) {
          Runtime.trap("Market is not active");
        };
      };
    };
    orderIdCounter += 1;
    let orderId = orderIdCounter;
    let newOrder = {
      orderId;
      marketId;
      orderType;
      shareType;
      price;
      quantity;
      user = caller;
      timestamp = Time.now();
    };
    orders.add(orderId, newOrder);
    orderId;
  };

  public shared ({ caller }) func cancelOrder(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.user != caller) {
          Runtime.trap("Unauthorized: Can only cancel your own orders");
        };
        orders.remove(orderId);
        return;
      };
    };
  };

  public query ({ caller }) func getOrderBook(marketId : Nat) : async [Order] {
    orders.filter(func(_, order) { order.marketId == marketId }).values().toArray();
  };

  public query ({ caller }) func getUserOrders(user : Principal) : async [Order] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.filter(func(_, order) { Principal.equal(order.user, user) }).values().toArray();
  };

  public query ({ caller }) func getTradeHistory(marketId : Nat) : async [Trade] {
    trades.filter(func(_, trade) { trade.marketId == marketId }).values().toArray();
  };

  public query ({ caller }) func getUserTrades(user : Principal) : async [Trade] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own trades");
    };
    trades.filter(func(_, trade) { Principal.equal(trade.buyer, user) or Principal.equal(trade.seller, user) }).values().toArray();
  };

  /*************** POSITIONS ***************/
  public query ({ caller }) func getUserPositions(user : Principal) : async [Position] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own positions");
    };
    switch (positions.get(user)) {
      case (null) { [] };
      case (?posSet) { posSet.toArray() };
    };
  };

  /*************** REWARDS ***************/
  public query ({ caller }) func getUserRewards(user : Principal) : async ?Reward {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own rewards");
    };
    rewards.get(user);
  };

  public query ({ caller }) func getTopRewardUsers() : async [Reward] {
    rewards.values().toArray().sort(Reward.compareByTotalPoints);
  };

  public shared ({ caller }) func claimRewards() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim rewards");
    };
    // Implementation for claiming rewards
  };

  /*************** MARKET RESOLUTION (ADMIN ONLY) ***************/
  public shared ({ caller }) func resolveMarket(marketId : Nat, outcome : { #yes; #no }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can resolve markets");
    };
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Market does not exist") };
      case (?market) {
        if (market.status == #resolved) {
          Runtime.trap("Market already resolved");
        };
        let updatedMarket = {
          marketId = market.marketId;
          question = market.question;
          description = market.description;
          category = market.category;
          resolutionDate = market.resolutionDate;
          creator = market.creator;
          yesPrice = market.yesPrice;
          noPrice = market.noPrice;
          volume = market.volume;
          status = #resolved;
        };
        markets.add(marketId, updatedMarket);
      };
    };
  };

  public shared ({ caller }) func updateMarketStatus(marketId : Nat, status : { #active; #resolved; #pending }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update market status");
    };
    switch (markets.get(marketId)) {
      case (null) { Runtime.trap("Market does not exist") };
      case (?market) {
        let updatedMarket = {
          marketId = market.marketId;
          question = market.question;
          description = market.description;
          category = market.category;
          resolutionDate = market.resolutionDate;
          creator = market.creator;
          yesPrice = market.yesPrice;
          noPrice = market.noPrice;
          volume = market.volume;
          status = status;
        };
        markets.add(marketId, updatedMarket);
      };
    };
  };
};
