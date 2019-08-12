namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um usuário.
    /// </summary>
    public class Usuario 
    {
        public int Id { get; set; }
        public string Login { get;  set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public bool IsAdmin { get; set; }
    }
}