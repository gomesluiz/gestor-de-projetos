using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um fornecedor.
    /// </summary>
    public class Fornecedor {

    [Required(ErrorMessage = "Por favor, digite o código do fornecedor.")]
    public int Id { get; set; }

    [StringLength(50, ErrorMessage = "O nome do fornecedor deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite o nome do fornecedor.")]
    public string Nome { get; set; }
  }
}