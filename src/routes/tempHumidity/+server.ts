import {error, json} from '@sveltejs/kit';
import {useSampleData} from '$lib';

export async function GET({ url }) {
    if(useSampleData){
        let deviceId = (url.searchParams.get('filter')!).slice(9, -2);
        let temps;
        switch(deviceId){
            case '9857153337916':
                temps = await import('../../sampleData/device1.json');
                break;
            case '198282125291056':
                temps = await import('../../sampleData/device2.json');
                break;
            case '154739819958156':
                temps = await import('../../sampleData/device3.json');
                break;
            default:
                temps = await import('../../sampleData/device1.json');
                break;
        }
        return json(temps);
    }else{
        let fetchUrl = new URL("http://raspberrypi.local:8090/api/collections/tempandhumidity/records");
        fetchUrl.searchParams.set('filter', url.searchParams.get('filter')!);
        fetchUrl.searchParams.set('sort', "-created");
        fetchUrl.searchParams.set('perPage', '720');

        let tempReq = await fetch(fetchUrl);
        let temps = await tempReq.json();
        return json(temps);
    }
}