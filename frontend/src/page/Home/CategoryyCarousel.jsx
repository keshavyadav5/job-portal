import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="max-w-3xl md:mx-w-4xl md:mx-auto mx-4  px-4 my-12">
      <Carousel className="mx-8 md:mx-10">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
             className="md:basis-1/2 lg:basis-1/3"
            >
              <Button
                className="w-full cursor-pointer bg-gray-700 text-white rounded-full hover:bg-gray-800"
                onClick={() => searchJobHandler(cat)}
                variant="outline"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
