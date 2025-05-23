"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import TiltCard from "@/components/tilt-card"

interface TiltCardCarouselProps {
  items: {
    title: string
    description: string
    date: string
    buttonText: string
  }[]
}

export default function TiltCardCarousel({ items }: TiltCardCarouselProps) {
  return (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4 pr-4">
            <TiltCard className="h-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3">{item.title}</h2>
                <p className="text-gray-600 mb-5 text-sm">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <button className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </TiltCard>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-8 gap-4">
        <CarouselPrevious className="relative static" />
        <CarouselNext className="relative static" />
      </div>
    </Carousel>
  )
}
