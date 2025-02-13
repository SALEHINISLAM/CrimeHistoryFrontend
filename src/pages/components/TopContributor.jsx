import React from "react";
import { useGetTopContributorsQuery } from "../../redux/features/users/user.api";

const TopContributors = () => {
    const { data: contributors, isLoading, isError } = useGetTopContributorsQuery();
    console.log(contributors)
    if (isLoading) return <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
            </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
    </div>;
    if (isError) return <div>Error fetching contributors</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Top Contributors</h2>
            <div className="space-y-3">
                {contributors?.data.map((contributor) => (
                    <div key={contributor.id} className="flex m-1 p-2 cursor-pointer rounded-md items-center space-x-3 hover:bg-gray-200">
                        <img
                            src={contributor.profile_pic} // Fallback image
                            alt={contributor?.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold">{contributor?.name}</p>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopContributors;