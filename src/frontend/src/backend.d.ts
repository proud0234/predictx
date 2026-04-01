import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Reward {
    streak: bigint;
    weeklyChallenge: bigint;
    earlyPredictor: bigint;
    user: Principal;
    referrals: bigint;
    totalPoints: bigint;
}
export interface Position {
    pnl: number;
    avgPrice: number;
    marketId: bigint;
    quantity: bigint;
    shareType: Variant_no_yes;
}
export interface Trade {
    seller: Principal;
    orderId: bigint;
    tradeId: bigint;
    marketId: bigint;
    timestamp: Time;
    quantity: bigint;
    buyer: Principal;
    price: number;
}
export interface Market {
    resolutionDate: Time;
    status: Variant_resolved_active_pending;
    creator: Principal;
    question: string;
    description: string;
    volume: bigint;
    marketId: bigint;
    noPrice: number;
    category: MarketCategory;
    yesPrice: number;
}
export interface Order {
    user: Principal;
    orderType: OrderType;
    orderId: bigint;
    marketId: bigint;
    timestamp: Time;
    quantity: bigint;
    shareType: Variant_no_yes;
    price: number;
}
export interface UserProfile {
    pnl: number;
    totalTrades: bigint;
    username: string;
    tier: Variant_bronze_gold_elite_silver;
    reputation: bigint;
    winRate: number;
}
export enum MarketCategory {
    entertainment = "entertainment",
    crypto = "crypto",
    technology = "technology",
    sports = "sports",
    politics = "politics"
}
export enum OrderType {
    buy = "buy",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_bronze_gold_elite_silver {
    bronze = "bronze",
    gold = "gold",
    elite = "elite",
    silver = "silver"
}
export enum Variant_no_yes {
    no = "no",
    yes = "yes"
}
export enum Variant_resolved_active_pending {
    resolved = "resolved",
    active = "active",
    pending = "pending"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: bigint): Promise<void>;
    claimRewards(): Promise<void>;
    /**
     * / ************* MARKETS **************
     */
    createMarket(question: string, description: string, category: MarketCategory, resolutionDate: Time): Promise<bigint>;
    createProfile(username: string): Promise<void>;
    getActiveMarkets(): Promise<Array<Market>>;
    getAllMarkets(): Promise<Array<Market>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMarket(marketId: bigint): Promise<Market>;
    getMarketsByCategory(category: MarketCategory): Promise<Array<Market>>;
    getMarketsByCreator(creator: Principal): Promise<Array<Market>>;
    getOrderBook(marketId: bigint): Promise<Array<Order>>;
    getTopRewardUsers(): Promise<Array<Reward>>;
    getTopUsersByPnl(): Promise<Array<UserProfile>>;
    getTopUsersByReputation(): Promise<Array<UserProfile>>;
    getTopUsersByWinRate(): Promise<Array<UserProfile>>;
    getTradeHistory(marketId: bigint): Promise<Array<Trade>>;
    getUserOrders(user: Principal): Promise<Array<Order>>;
    /**
     * / ************* POSITIONS **************
     */
    getUserPositions(user: Principal): Promise<Array<Position>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / ************* REWARDS **************
     */
    getUserRewards(user: Principal): Promise<Reward | null>;
    getUserTrades(user: Principal): Promise<Array<Trade>>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / ************* USERS/PROFILES **************
     */
    isUsernameTaken(username: string): Promise<boolean>;
    /**
     * / ************* TRADING **************
     */
    placeOrder(marketId: bigint, orderType: OrderType, shareType: Variant_no_yes, price: number, quantity: bigint): Promise<bigint>;
    /**
     * / ************* MARKET RESOLUTION (ADMIN ONLY) **************
     */
    resolveMarket(marketId: bigint, outcome: Variant_no_yes): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMarketStatus(marketId: bigint, status: Variant_resolved_active_pending): Promise<void>;
}
