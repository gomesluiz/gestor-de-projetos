using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Ferrero.GestorDeProjetos.Web.Models.Helpers
{
    public class FileUploadHelper
    {
        public async Task<string> SaveFileAsync(IFormFile file, string pathToUpload
            , string renameFileTo = "")
        {
            
            if (!Directory.Exists(pathToUpload))
                System.IO.Directory.CreateDirectory(pathToUpload);
            
            string fileName = renameFileTo;
            if (string.IsNullOrEmpty(renameFileTo))
            {
                fileName = GetFileName(file, true);
            } 
            
            string pathWithFileName = Path.Combine(pathToUpload, fileName);
            using(var fileStream = new FileStream(pathWithFileName, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);    
            }

            return fileName;
        }

        public string GetFileName(IFormFile file, bool buildUniqueName)
        {
            string fileName     = string.Empty;
            string fileExtension = Path.GetExtension(file.FileName);
            if (buildUniqueName)
            {
                string strUniqueName = GetUniqueName("doc_");
                fileName = strUniqueName + fileExtension;
            } 
            else 
            {
                string strFileName = "oc_" + Path.GetFileNameWithoutExtension(file.FileName);
                fileName = strFileName;
            }
            return fileName;
        }
        
        private string GetFileExtension(IFormFile file)
        {
            string fileExtension;
            fileExtension = (file != null) ?
                file.FileName.Substring(file.FileName.LastIndexOf('.')).ToLower()
                : string.Empty;
            return fileExtension;
        }

        private string GetUniqueName(string preFix)
        {
            string uniqueName = preFix + DateTime.Now.ToString()
                .Replace("/", "-")
                .Replace(":", "-")
                .Replace(" ", string.Empty)
                .Replace("PM", string.Empty)
                .Replace("AM", string.Empty);
            return uniqueName;
        }

    }
}
