export function generatePagination(currentPage, totalPages, itemsPerPage) {
  const halfItemsPerPage = Math.floor(itemsPerPage / 2);
  let start = Math.max(1, currentPage - halfItemsPerPage);
  let end = Math.min(start + itemsPerPage - 1, totalPages);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
