using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Ferrero.GestorDeProjetos.Web.Models.Helpers
{
    public static class FileUploadHelper
    {
        public static async Task<UploadDownloadResponse> DoUpload(IFormFile content, string uploadPath, string localFileName)
        { 

            try{
                if (localFileName != null && content == null)
                    return new UploadDownloadResponse (UploadDownloadResponse.STATUS_OK);

                if (content == null || content.Length == 0)
                    return new UploadDownloadResponse(UploadDownloadResponse.STATUS_NOK
                        , "Arquivo não foi selecionado!");

                if (FileDownloadHelper.GetContentType(content.FileName) == null){
                    return new UploadDownloadResponse(UploadDownloadResponse.STATUS_NOK
                        , "Extensão do arquivo inválida!");
                }
                var remoteFileName = await FileUploadHelper.SaveFileAsync(content, uploadPath, localFileName);

                return new UploadDownloadResponse(UploadDownloadResponse.STATUS_OK,
                    fileName: remoteFileName);
                } 
            catch (Exception e)
            {
                return new UploadDownloadResponse(UploadDownloadResponse.STATUS_NOK, e.Message);
            }
        }
        public static async Task<string> SaveFileAsync(IFormFile file, string pathToUpload
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

        public static string GetFileName(IFormFile file, bool buildUniqueName)
        {
            string fileName     = string.Empty;
            string fileExtension = Path.GetExtension(file.FileName);
            if (buildUniqueName)
            {
                string strUniqueName = GetUniqueName("file_");
                fileName = strUniqueName + fileExtension;
            } 
            else 
            {
                string strFileName = "file_" + Path.GetFileNameWithoutExtension(file.FileName);
                fileName = strFileName;
            }
            return fileName;
        }
        
        private static string GetFileExtension(IFormFile file)
        {
            string fileExtension;
            fileExtension = (file != null) ?
                file.FileName.Substring(file.FileName.LastIndexOf('.')).ToLower()
                : string.Empty;
            return fileExtension;
        }

        private static string GetUniqueName(string preFix)
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
