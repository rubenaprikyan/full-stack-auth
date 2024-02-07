import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageSliderProps {
  images: { url: string; name: string }[];
}
function ImageSlider(props: ImageSliderProps) {
  const [animate, setAnimate] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  if (!props.images.length) {
    return (
      <div>
        <p className="mt-5 text-sm tracking-tight">No Images</p>
      </div>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className={cn(
        'flex w-full max-w-xs justify-center transition-opacity duration-700 ease-in-out',
        animate ? 'opacity-100' : 'opacity-0',
      )}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {props.images.map(({ url, name }) => (
          <CarouselItem key={url}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-1">
                <Image
                  src={url}
                  alt={name}
                  className="aspect-square h-full w-full shadow-md"
                  width={400}
                  height={400}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ImageSlider;
