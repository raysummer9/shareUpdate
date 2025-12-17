"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Instagram, Code, TrendingUp, Paintbrush, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    icon: Instagram,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    title: "Social Media Accounts",
    description: "Instagram, Twitter, TikTok, YouTube channels",
    count: "5,234 listings",
  },
  {
    icon: Code,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Web Development",
    description: "Websites, landing pages, web apps",
    count: "3,891 services",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "SaaS Accounts",
    description: "Premium tools, software subscriptions",
    count: "2,156 listings",
  },
  {
    icon: Paintbrush,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Design Services",
    description: "Logos, graphics, UI/UX design",
    count: "4,567 services",
  },
];

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const IconComponent = category.icon;
  
  return (
    <div className="flex-[0_0_85%] sm:flex-none min-w-0 px-2">
      <Link
        href={`/categories/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
        className="block bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      >
        {/* Icon */}
        <div className={`${category.iconBg} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
          <IconComponent className={`h-8 w-8 ${category.iconColor}`} />
        </div>

        {/* Content */}
        <div className="text-left flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {category.title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base flex-1">
            {category.description}
          </p>
          <div className="flex items-center text-red-600 font-medium mt-auto">
            <span className="text-sm md:text-base">{category.count}</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PopularCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start", 
    dragFree: true,
    loop: true,
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    // With loop enabled, buttons are never disabled
    setPrevBtnDisabled(false);
    setNextBtnDisabled(false);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full py-16 md:py-24" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thousands of digital products and services.
          </p>
        </motion.div>

        {/* Mobile Slider */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {categories.map((category, index) => (
                <CategoryCard key={category.title} category={category} index={index} />
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/categories/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  {/* Icon */}
                  <div className={`${category.iconBg} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className={`h-8 w-8 ${category.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="text-left flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base flex-1">
                      {category.description}
                    </p>
                    <div className="flex items-center text-red-600 font-medium mt-auto">
                      <span className="text-sm md:text-base">{category.count}</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

