-- არსებული ნაწილები საიტიდან რომ არ გაქრეს, მათ მარაგად 1 ეწერებათ. ახალი ნაწილის ნაგულისხმევი მარაგი 0-ია.
ALTER TABLE "parts" ADD COLUMN "stock" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "parts" ALTER COLUMN "stock" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_stock_not_negative" CHECK ("parts"."stock" >= 0);
