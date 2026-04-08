const { ConsultarMunicipiosV2 } = require('../../queries/generales/MunicipiosQuery');

const ListarMunicipiosService = async (page, limit, search) => {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number(limit) > 0 ? Number(limit) : 10;
    const term = typeof search === 'string' ? search.trim() : '';

    const offset = (pageNumber - 1) * pageSize;

    const results = await ConsultarMunicipiosV2(pageSize, offset, term);

    if (!results || results.length === 0) {
        return {
            rows: [],
            totalItems: 0,
            totalPages: 0
        };
    }

    const totalItems = Number(results[0].TotalCount || 0);
    const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 0;

    const rows = results.map(({ TotalCount, ...row }) => row);

    return {
        rows,
        totalItems,
        totalPages
    };
};
module.exports = {
    ListarMunicipiosService
}
