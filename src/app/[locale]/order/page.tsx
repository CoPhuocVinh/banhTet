import { redirect } from "next/navigation";

interface OrderPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/checkout`);
}
