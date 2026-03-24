-- CreateTable
CREATE TABLE "TopicEvidence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT NOT NULL,
    "bucketTime" DATETIME NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TopicEvidence_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TopicCount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT NOT NULL,
    "topicLabel" TEXT NOT NULL DEFAULT '',
    "bucketTime" DATETIME NOT NULL,
    "count" INTEGER NOT NULL
);
INSERT INTO "new_TopicCount" ("bucketTime", "count", "id", "topic") SELECT "bucketTime", "count", "id", "topic" FROM "TopicCount";
DROP TABLE "TopicCount";
ALTER TABLE "new_TopicCount" RENAME TO "TopicCount";
CREATE UNIQUE INDEX "TopicCount_topic_bucketTime_key" ON "TopicCount"("topic", "bucketTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TopicEvidence_topic_bucketTime_idx" ON "TopicEvidence"("topic", "bucketTime");

-- CreateIndex
CREATE UNIQUE INDEX "TopicEvidence_topic_bucketTime_postId_key" ON "TopicEvidence"("topic", "bucketTime", "postId");
