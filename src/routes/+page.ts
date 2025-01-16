import type { PageLoad } from './$types';

export const load: PageLoad = async ( {fetch} ) => {
    let devicesReq = await fetch("http://raspberrypi.local:8090/api/collections/devices/records");
    let devices = await devicesReq.json();
    return { devices };
};