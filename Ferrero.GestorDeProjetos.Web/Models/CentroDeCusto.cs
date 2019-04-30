using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um centro de custo.
  /// </summary>
  public class CentroDeCusto {

    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    [Required(ErrorMessage = "Por favor, digite o número do centro de custo.")]
    public int ID { get; set; }

    [Required(ErrorMessage = "Por favor, digite o nome do centro de custo.")]
    public string Nome { get; set; }
  }
}