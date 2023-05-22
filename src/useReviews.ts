import { useQuery } from "react-query";
import { ethers } from "ethers";

const tokenAddress = "0x15e43e82A8B9dD59121B8d845D26CE62eCb0323E";
const abi = [
  "function addReview(string _reviewText)",
  "function getReview(uint256 _reviewId) view returns (tuple(address reviewer, string reviewText))",
  "function getReviewCount() view returns (uint256)",
  "function getReviews(uint256 _pageNumber, uint256 _pageSize) view returns (tuple(address reviewer, string reviewText)[])",
  "function reviewCount() view returns (uint256)",
  "function reviews(uint256) view returns (address reviewer, string reviewText)",
];
const provider = new ethers.JsonRpcProvider("https://rpc2.sepolia.org/");
const contract = new ethers.Contract(tokenAddress, abi, provider);

export interface Review {
  address: string;
  review: string;
}

export default function useReviews(size = 15) {
  const reviews = (page: number) => {
    return useQuery<Review[]>({
      queryKey: ["reviews", page, size],
      queryFn: async () => {
        const data: Review[] = await contract.getReviews(page, size);
        const jsonifiedData: string[][] = JSON.parse(JSON.stringify(data));
        const arr = jsonifiedData.map((i) => ({ address: i[0], review: i[1] }));
        return arr;
      },
    });
  };

  const review = (id: string) =>
    useQuery<Review>({
      queryKey: ["review", id],
      queryFn: async () => {
        const data: Review = await contract.getReview(id);
        const jsonifiedData: string[] = JSON.parse(JSON.stringify(data));
        return { address: jsonifiedData[0], review: jsonifiedData[1] };
      },
    });
  const reviewCount = () =>
    useQuery<Number>({
      queryKey: ["review"],
      queryFn: async () => {
        const data: Number = await contract.getReviewCount();
        return data;
      },
    });

  return {
    reviews,
    review,
    reviewCount,
  };
}
