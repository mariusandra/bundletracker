-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "json" JSONB NOT NULL DEFAULT '{}',

    PRIMARY KEY ("id")
);
