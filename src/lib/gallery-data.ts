import natureLake from "@/assets/gallery/nature-lake.jpg";
import natureForest from "@/assets/gallery/nature-forest.jpg";
import architectureGlass from "@/assets/gallery/architecture-glass.jpg";
import architectureStairs from "@/assets/gallery/architecture-stairs.jpg";
import peoplePortrait from "@/assets/gallery/people-portrait.jpg";
import peopleStreet from "@/assets/gallery/people-street.jpg";
import travelCoast from "@/assets/gallery/travel-coast.jpg";
import travelDesert from "@/assets/gallery/travel-desert.jpg";

export type Category = "All" | "Nature" | "Architecture" | "People" | "Travel";

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: Exclude<Category, "All">;
  location: string;
  aspect: "landscape" | "portrait";
}

export const categories: Category[] = ["All", "Nature", "Architecture", "People", "Travel"];

export const galleryImages: GalleryImage[] = [
  {
    id: "nature-lake",
    src: natureLake,
    title: "Alpine Mirror",
    category: "Nature",
    location: "Dolomites, Italy",
    aspect: "landscape",
  },
  {
    id: "nature-forest",
    src: natureForest,
    title: "Pine Cathedral",
    category: "Nature",
    location: "Black Forest, Germany",
    aspect: "portrait",
  },
  {
    id: "architecture-glass",
    src: architectureGlass,
    title: "Prism Facade",
    category: "Architecture",
    location: "Berlin, Germany",
    aspect: "landscape",
  },
  {
    id: "architecture-stairs",
    src: architectureStairs,
    title: "Spiral Ascent",
    category: "Architecture",
    location: "Lisbon, Portugal",
    aspect: "portrait",
  },
  {
    id: "people-portrait",
    src: peoplePortrait,
    title: "Window Light",
    category: "People",
    location: "Studio Session",
    aspect: "portrait",
  },
  {
    id: "people-street",
    src: peopleStreet,
    title: "Market Motion",
    category: "People",
    location: "Hong Kong",
    aspect: "landscape",
  },
  {
    id: "travel-coast",
    src: travelCoast,
    title: "Coastal Cascade",
    category: "Travel",
    location: "Cyclades, Greece",
    aspect: "landscape",
  },
  {
    id: "travel-desert",
    src: travelDesert,
    title: "Dune Rhythm",
    category: "Travel",
    location: "Sahara, Morocco",
    aspect: "landscape",
  },
];
