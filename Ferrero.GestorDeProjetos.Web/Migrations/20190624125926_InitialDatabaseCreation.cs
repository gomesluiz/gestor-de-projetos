using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Ferrero.GestorDeProjetos.Web.Migrations
{
    public partial class InitialDatabaseCreation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CentrosDeCusto",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Nome = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CentrosDeCusto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projetos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(maxLength: 50, nullable: false),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    DataDeInicio = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    DataDeTermino = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    Concluido = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projetos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrdensDeInvestimento",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<string>(maxLength: 7, nullable: false),
                    ProjetoId = table.Column<int>(nullable: true),
                    Valor = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdensDeInvestimento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdensDeInvestimento_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ativos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Descricao = table.Column<string>(maxLength: 50, nullable: false),
                    OrdemDeInvestimentoId = table.Column<int>(nullable: true),
                    CentroDeCustoId = table.Column<int>(nullable: true),
                    Planta = table.Column<string>(maxLength: 50, nullable: false),
                    Quantidade = table.Column<int>(nullable: false),
                    Divisao = table.Column<int>(nullable: false),
                    Natureza = table.Column<int>(nullable: false),
                    Propriedade = table.Column<int>(nullable: false),
                    DestinoDeUso = table.Column<int>(nullable: false),
                    SituacaoParaUso = table.Column<int>(nullable: false),
                    Observacoes = table.Column<string>(maxLength: 250, nullable: true),
                    Requisitante = table.Column<string>(maxLength: 50, nullable: true),
                    SituacaoDoAtivo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ativos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ativos_CentrosDeCusto_CentroDeCustoId",
                        column: x => x.CentroDeCustoId,
                        principalTable: "CentrosDeCusto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ativos_OrdensDeInvestimento_OrdemDeInvestimentoId",
                        column: x => x.OrdemDeInvestimentoId,
                        principalTable: "OrdensDeInvestimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrdensDeCompra",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<long>(nullable: false),
                    Data = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    NumeroDaRequisicao = table.Column<long>(nullable: false),
                    Valor = table.Column<double>(nullable: false),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    AtivoId = table.Column<int>(nullable: true),
                    DocumentoPath = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdensDeCompra", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdensDeCompra_Ativos_AtivoId",
                        column: x => x.AtivoId,
                        principalTable: "Ativos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NotasFiscais",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<int>(nullable: false),
                    DataDeLancamento = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    FornecedorId = table.Column<int>(nullable: true),
                    OrdemDeCompraId = table.Column<int>(nullable: true),
                    Migo = table.Column<long>(nullable: false),
                    Valor = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotasFiscais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotasFiscais_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NotasFiscais_OrdensDeCompra_OrdemDeCompraId",
                        column: x => x.OrdemDeCompraId,
                        principalTable: "OrdensDeCompra",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_CentroDeCustoId",
                table: "Ativos",
                column: "CentroDeCustoId");

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_OrdemDeInvestimentoId",
                table: "Ativos",
                column: "OrdemDeInvestimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_NotasFiscais_FornecedorId",
                table: "NotasFiscais",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_NotasFiscais_OrdemDeCompraId",
                table: "NotasFiscais",
                column: "OrdemDeCompraId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeCompra_AtivoId",
                table: "OrdensDeCompra",
                column: "AtivoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdensDeInvestimento_ProjetoId",
                table: "OrdensDeInvestimento",
                column: "ProjetoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotasFiscais");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "OrdensDeCompra");

            migrationBuilder.DropTable(
                name: "Ativos");

            migrationBuilder.DropTable(
                name: "CentrosDeCusto");

            migrationBuilder.DropTable(
                name: "OrdensDeInvestimento");

            migrationBuilder.DropTable(
                name: "Projetos");
        }
    }
}
