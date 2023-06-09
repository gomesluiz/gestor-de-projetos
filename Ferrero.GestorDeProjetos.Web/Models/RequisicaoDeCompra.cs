using System;
using Ferrero.GestorDeProjetos.Web.Models.Domain;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de uma requisição 
    /// de compra.
    /// </summary>
    public class RequisicaoDeCompra {
    public int Id { get; set; }
    public long Numero { get; set; }
    public DateTime Data { get; set; }
    public long? NumeroDaOrdemDeCompra { get; set; }
    public string Descricao { get; set; }
    public Ativo Ativo { get; set; }
    public string Proposta {get; set;}
  }
}