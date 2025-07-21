import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center text-white h-[44vh] items-center px-5 md:px-0 text-xs md:text-base">
        <div className="font-bold md:text-5xl flex justify-center items-center gap-4 text-xl">
          Buy Me a Chai
          <span>
            <img
              className="rounded-b-xl invertImg"
              src="/tea1.gif"
              width={88}
              alt=""
            />
          </span>
        </div>
        <p className="py-2 text-lg text-center md:text-left">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          asperiores facilis quos natus nihil nisi vel accusantium.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
          <Link href={"/Login"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 hover:cursor-pointer"
            >
              Start Now
            </button>
          </Link>
          <Link href={"/About"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 hover:cursor-pointer"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"> </div>

      <div className="text-white container mx-auto pb-32 pt-14 px-4">
        <h1 className="text-3xl font-bold text-center mb-14">
          Your Fans can buy you a chay
        </h1>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="items space-y-3 flex flex-col items-center justify-center text-center max-w-xs"
            >
              <img
                className="w-16 h-16 rounded-full bg-slate-400 object-cover"
                src="/main.gif"
                alt="main"
              />
              <p className="font-bold">Fans want to help you</p>
              <p>Your fans are available for you to help you</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"> </div>

      <div className="text-white container mx-auto pb-32 pt-14 px-4">
        <h1 className="text-3xl font-bold text-center mb-14">
          Learn More about Us
        </h1>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="items space-y-3 flex flex-col items-center justify-center text-center max-w-xs"
            >
              <img
                className="w-16 h-16 rounded-full bg-slate-400 object-cover"
                src="/main.gif"
                alt="main"
              />
              <p className="font-bold">Fans want to help you</p>
              <p>Your fans are available for you to help you</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      <div className="text-white container mx-auto pb-32 pt-14 px-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-14">
          Learn more about us – this is video section
        </h1>
        <div className="w-full max-w-2xl aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/MbZN28Ll4pw?si=PwDV78CpHlT7xuPm"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
}
