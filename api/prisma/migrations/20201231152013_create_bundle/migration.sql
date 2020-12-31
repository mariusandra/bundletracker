-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "tree" JSONB NOT NULL DEFAULT '{}',
    "meta" JSONB NOT NULL DEFAULT '{}',

    PRIMARY KEY ("id")
);
