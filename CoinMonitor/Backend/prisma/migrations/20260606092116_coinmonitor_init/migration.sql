-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ABOVE', 'BELOW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coin" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "coingecko_id" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist_Coin" (
    "watchlist_id" INTEGER NOT NULL,
    "coin_id" INTEGER NOT NULL,
    "price_at_add" DECIMAL(15,8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_Coin_pkey" PRIMARY KEY ("watchlist_id","coin_id")
);

-- CreateTable
CREATE TABLE "Coin_Alert" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "coin_id" INTEGER NOT NULL,
    "threshold_price" DECIMAL(15,8) NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coin_Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_watchlists_user" ON "Watchlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_coingecko_id_key" ON "Coin"("coingecko_id");

-- CreateIndex
CREATE INDEX "idx_coins_symbol" ON "Coin"("symbol");

-- CreateIndex
CREATE INDEX "idx_watchlist_coins_watchlist" ON "Watchlist_Coin"("watchlist_id");

-- CreateIndex
CREATE INDEX "idx_coin_alerts_user" ON "Coin_Alert"("user_id");

-- CreateIndex
CREATE INDEX "idx_coin_alerts_coin" ON "Coin_Alert"("coin_id");

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist_Coin" ADD CONSTRAINT "Watchlist_Coin_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist_Coin" ADD CONSTRAINT "Watchlist_Coin_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "Coin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coin_Alert" ADD CONSTRAINT "Coin_Alert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coin_Alert" ADD CONSTRAINT "Coin_Alert_coin_id_fkey" FOREIGN KEY ("coin_id") REFERENCES "Coin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
