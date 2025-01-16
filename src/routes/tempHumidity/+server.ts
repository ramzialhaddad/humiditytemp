import {error, json} from '@sveltejs/kit';

export async function GET({ url }) {
    let fetchUrl = new URL("http://raspberrypi.local:8090/api/collections/tempandhumidity/records");
    fetchUrl.searchParams.set('filter', url.searchParams.get('filter')!);
    fetchUrl.searchParams.set('sort', "-created");
    fetchUrl.searchParams.set('perPage', '720');

    let tempReq = await fetch(fetchUrl);
    let temps = await tempReq.json();
    return json(temps);
}