import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Categories from "../components/home/Categories";
import FeaturedProperties from "../components/property/FeaturedProperties";

function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedProperties />
    </Layout>
  );
}

export default Home;