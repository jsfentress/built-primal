import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LatestCarousel({ posts }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Lazy hydrate when component becomes visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && swiperRef.current) {
          // Component is visible, Swiper will initialize automatically
        }
      });
    });

    if (swiperRef.current) {
      observer.observe(swiperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={swiperRef} className="latest-carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="latest-swiper"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Post Image</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {post.data.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {post.data.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.data.pubDatetime).toLocaleDateString()}
                  </span>
                  <a
                    href={`/posts/${post.slug}`}
                    className="text-accent hover:text-accent/80 text-sm font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 