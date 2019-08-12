namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um documento.
    /// </summary>
    public class Documento 
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get;  set; }
        public string Versao { get; set; }
        public string Arquivo { get; set; }
        public int ProjetoId { get; set; }
        public Projeto Projeto { get; set; }
    }
}