using Microsoft.EntityFrameworkCore.Migrations;

namespace Ferrero.GestorDeProjetos.Web.Migrations
{
    public partial class CentrosDeCustosCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CentroDeCusto",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false),
                    Nome = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CentroDeCusto", x => x.ID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CentroDeCusto");
        }
    }
}
