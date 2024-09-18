import Image from "next/image";

export default function Home() {
  console.log(process.env.NEXTAUTH_SECRET)
  return (
    <div>
      Hello world
    </div>
  );
}
