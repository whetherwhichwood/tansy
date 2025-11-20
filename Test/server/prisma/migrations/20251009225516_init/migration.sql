-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'administrator',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "recommendations" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_profiles" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT,
    "age" INTEGER NOT NULL,
    "zip_code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "coverage_type" TEXT NOT NULL,
    "num_dependents" INTEGER NOT NULL DEFAULT 0,
    "dependent_ages" INTEGER[],
    "ichra_allowance" DECIMAL(10,2) NOT NULL,
    "budget_flexibility" DECIMAL(10,2),
    "income_level" DECIMAL(10,2),
    "health_status" TEXT NOT NULL,
    "medical_needs" TEXT NOT NULL,
    "chronic_conditions" TEXT[],
    "prescription_count" INTEGER NOT NULL DEFAULT 0,
    "preferred_providers" TEXT[],
    "plan_type_preference" TEXT,
    "risk_tolerance" TEXT NOT NULL,
    "priorities" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "carrier_name" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "metal_tier" TEXT,
    "state" TEXT NOT NULL,
    "zip_codes" TEXT[],
    "monthly_premium" DECIMAL(10,2) NOT NULL,
    "annual_deductible" DECIMAL(10,2) NOT NULL,
    "oop_maximum" DECIMAL(10,2) NOT NULL,
    "pcp_copay" DECIMAL(10,2),
    "specialist_copay" DECIMAL(10,2),
    "er_copay" DECIMAL(10,2),
    "urgent_care_copay" DECIMAL(10,2),
    "generic_rx_copay" DECIMAL(10,2),
    "network_type" TEXT,
    "network_size" TEXT,
    "hsa_eligible" BOOLEAN NOT NULL DEFAULT false,
    "provider_list" TEXT[],
    "formulary" JSONB,
    "benefits_summary" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_date" TIMESTAMP(3),
    "termination_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "total_score" DECIMAL(5,2) NOT NULL,
    "affordability_score" DECIMAL(5,2),
    "coverage_score" DECIMAL(5,2),
    "network_score" DECIMAL(5,2),
    "plan_type_score" DECIMAL(5,2),
    "oop_protection_score" DECIMAL(5,2),
    "reasoning" TEXT,
    "key_benefits" JSONB,
    "trade_offs" JSONB,
    "budget_analysis" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_profiles_session_id_key" ON "employee_profiles"("session_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
