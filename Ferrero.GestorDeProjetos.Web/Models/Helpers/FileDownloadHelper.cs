using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ferrero.GestorDeProjetos.Web.Models.Helpers
{
    public static class FileDownloadHelper
    {
        public static async Task<MemoryStream> Download(string pathToDownload, string fileName)
        {
            var memory = new MemoryStream();
            var stream = new FileStream(Path.Combine(pathToDownload, fileName), FileMode.Open);
            await stream.CopyToAsync(memory);
            memory.Position = 0;
            return memory;
        }

        public static string GetContentType(string fileName)
        {
            var types = GetMineTypes();
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return types[extension];
        }

        private static Dictionary<string, string> GetMineTypes(){
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".ppt", "application/vnd.ms-powerpoint"},
                {".pptx", "application/vnd.vnd.openxmlformats-officedocument.presentationml.presentation"},
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
