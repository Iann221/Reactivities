
using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, 
        int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            // format menjadi pagination Headerjson string dan beri key "Pagination" as a header
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader)); 
            // krn pagination ini custom header, kita hrs expose agar bisa dibaca browser
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); 
         }
    }
}