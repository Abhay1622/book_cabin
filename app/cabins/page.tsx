import React from 'react';
import { prisma } from '@/lib/prisma';
import CabinClient from './CabinClient';


const CabinListing = async () => {
    const cabins = await prisma.cabin.findMany({
        orderBy: { name: 'asc' }
    });

    return <CabinClient cabins={cabins} />;
};

export default CabinListing;