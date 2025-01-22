import Map from '@/components/map/map';
import { Button } from '../ui/button';
import { useChat } from "ai/react";
import { useState, memo } from 'react';

const ListStores = memo(function ListStores({ stores }: any) {
  const { append } = useChat({ id: "store-select" });
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <div className='grid grid-cols-2 gap-3'>
        {stores?.slice(0, 2)?.map((address: any, index: number) => (
          <div key={index} className="flex flex-col gap-2 h-64 w-64">
            <Map
              longitude={address.StoreCoordinates.StoreLongitude || 0}
              latitude={address.StoreCoordinates.StoreLatitude || 0}
              zoom={12}
            />
            <Button
              disabled={clicked}
              onClick={async () => {
                setClicked(true);
                append({ role: "user", content: "I want to order from this address: " + address?.AddressDescription });
              }}
              variant={clicked ? "default" : "outline"}>{clicked ? "Selected" : "Select"}
            </Button>
          </div>
        ))}
      </div>
      {stores?.length > 3 && (
        <p className="text-sm text-gray-500 mt-2">
          +{stores.length - 3} more stores available
        </p>
      )}
    </>
  )
});

export default ListStores;