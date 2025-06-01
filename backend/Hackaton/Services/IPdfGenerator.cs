namespace Hackaton.Services;

public interface IPdfGenerator
{
    byte[] GenerateInvoicePdf(InvoiceModel model);
}