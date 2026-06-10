import TopCategories from "../charts/categories/TopCategories";

const TopCategoriesCard = () => {
  return (
    <div className="w-full h-[350px] flex flex-col justify-center border-2 border-gray-700 rounded-t-md p-5">
      <h1 className="uppercase text-dashboard-color text-lg">
        Where does your money go?
      </h1>
      <TopCategories />
    </div>
  );
};

export default TopCategoriesCard;
