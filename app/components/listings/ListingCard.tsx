'use client';

import useCountries from '@/app/hooks/useCountries';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import HeartButton from '../HeartButton';
import Button from '../CustomButton';

type ListingCardProps = {
   data: SafeListing;
   reservation?: SafeReservation;
   onAction?: (id: string) => void;
   disabled?: boolean;
   actionLabel?: string;
   actionId?: string;
   currentUser?: SafeUser | null;
};

const ListingCard = ({
   data,
   reservation,
   onAction,
   disabled,
   actionLabel,
   actionId = '',
   currentUser,
}: ListingCardProps) => {
   const router = useRouter();
   const { getByValue } = useCountries();

   const location = getByValue(data.locationValue);

   const handleCancel = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
         e.stopPropagation();

         if (disabled) {
            return;
         }

         onAction?.(actionId);
      },
      [onAction, actionId, disabled]
   );

   const price = useMemo(() => {
      if (reservation) {
         return reservation.totalPrice;
      }

      return data.price;
   }, [reservation, data.price]);

   const reservationDate = useMemo(() => {
      if (!reservation) {
         return null;
      }

      // @ts-ignore
      const start = format(new Date(reservation.startDate), 'PP');
      // @ts-ignore
      const end = format(new Date(reservation.endDate), 'PP');

      return `${start} - ${end}`;
   }, [reservation]);

   return (
      <div
         onClick={() => router.push(`/listings/${data.id}`)}
         className='col-span-1 cursor-pointer group'
      >
         <div className='flex flex-col gap-2 w-full'>
            <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
               <Image
                  fill
                  alt='Listing'
                  src={data.imageSrc}
                  className='object-cover h-full w-full scale-110 group-hover:scale-100 transition'
               />
               <div className='absolute top-3 right-3'>
                  <HeartButton listingId={data.id} currentUser={currentUser} />
               </div>
            </div>
            <div className='font-semibold text-lg'>
               {location?.region}, {location?.label}
            </div>
            <div className='font-light text-neutral-500'>
               {reservationDate || data.category}
            </div>
            <div className='flex flex-row items-center gap-1'>
               <div className='font-semibold'>$ {price}</div>
               {!reservation && <div className='font-light'>night</div>}
            </div>
            {onAction && actionLabel && (
               <Button
                  disabled={disabled}
                  small
                  label={actionLabel}
                  onClick={handleCancel}
               />
            )}
         </div>
      </div>
   );
};

export default ListingCard;