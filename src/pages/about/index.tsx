import React from "react";
import Image from "next/image";
import { NextPage } from "next";

const AboutPage: NextPage = () => {
  return (
    <div className="container mx-auto mt-8 px-4 lg:px-10">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between space-y-4  lg:space-y-0">
        <div className="flex-shrink-0">
          <Image
            src="/images/about.webp"
            alt="About Image"
            width={550}
            height={550}
            className="rounded-lg"
          />
        </div>
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
            About Our Blog
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to BogNation, where we help you share insightful stories and
            information. Our mission is to give you freedom and flexibility to
            write your own content. Whether it's about food or books, you'll
            find something valuable here.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our team is passionate about helping you write whatever you desire,
            and we strive to deliver high-quality content that benefits readers
            and writers. Join our community and explore.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Follow along and discover new perspectives on Food recipes or even
            Technology through engaging articles, tutorials, and more. Don't
            forget to connect with us on Facebook and Twitter for updates and
            discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
