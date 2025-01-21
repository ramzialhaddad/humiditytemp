import type { PageLoad } from './$types';
import {useSampleData} from '$lib';

export const load: PageLoad = async ( {fetch} ) => {
    if(useSampleData){
        let devices = await import('../sampleData/devices.json');
        return {devices};
    }else{
        let devicesReq = await fetch("http://raspberrypi.local:8090/api/collections/devices/records");
        let devices = await devicesReq.json();
        return { devices };
    }

};