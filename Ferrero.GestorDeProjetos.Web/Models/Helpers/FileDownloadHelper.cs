using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using  Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Mvc;

namespace Ferrero.GestorDeProjetos.Web.Models.Helpers
{
    public class FileDownloadHelper
    {
        public async Task<MemoryStream> Download(string pathToDownload, string fileName)
        {
            var memory = new MemoryStream();
            var stream = new FileStream(Path.Combine(pathToDownload, fileName), FileMode.Open);
            await stream.CopyToAsync(memory);
            memory.Position = 0;
            return memory;
        }

        public string GetContentType(string fileName)
        {
            var types = GetMineTypes();
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return types[extension];
        }

        private Dictionary<string, string> GetMineTypes(){
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
        
    }
}
