export default async function Component(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  return <div>さんぷる</div>;
}
