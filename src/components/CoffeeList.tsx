"use client"
import { useCoffeeData } from '../hooks/useCoffeeData';

const CoffeeList = () => {
    const { data, isLoading, isError, error } = useCoffeeData();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    console.log(data);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((coffee) => (
                <div
                    key={coffee.id}
                    className="border rounded-lg overflow-hidden shadow-lg"
                >
                    <img
                        src={coffee.image}
                        alt={coffee.title}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{coffee.title}</h2>
                        <p className="text-gray-600 mb-4">{coffee.description}</p>
                        <div>
                            <h3 className="font-semibold mb-2">Ingredients:</h3>
                            <ul className="list-disc list-inside">
                                {coffee.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CoffeeList; 