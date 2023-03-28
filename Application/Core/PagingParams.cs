using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50; // set page size tpi kurang dari 50
        public int PageNumber { get; set; } = 1;
        // shortcut propfull:
        private int _pageSize = 10; // default value 10
        public int PageSize
        {
            get { return _pageSize; } // lbh pendek: get => _pageSize
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        //
    }
}