const detailsCache = new MemoryCache('projects');

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const updatedSince = query.updatedSince as string | undefined;

    if (!updatedSince) {
        throw new Error('updatedSince not provided');
    }

    if (typeof updatedSince !== 'string') {
        throw new Error('updatedSince is not a string');
    }

    if (detailsCache.has(updatedSince)) {
        return detailsCache.get(updatedSince);    
    } else {
        const response = await $fetch('https://techport.nasa.gov/api/projects', {
            params: { updatedSince }
        });

        detailsCache.set(updatedSince, response);

        return response;
    }
});
