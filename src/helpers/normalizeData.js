export const normalizeData = (info) => {
    const { data } = info;
    const normalized = [...data.users];
    const page = data.page;
    const totalPage = data.total_pages;
    const nextLink = data.links.next_url;
    return { nextLink, normalized, page, totalPage };
  };
  