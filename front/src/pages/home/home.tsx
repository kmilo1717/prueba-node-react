import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, Plus, Trash } from "lucide-react"
import { app } from "@/atoms/kuepa"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LeadService } from "@/services/leadService"

interface Lead {
  _id: string
  incremental: number
  full_name: string
  email: string
  mobile_phone: string
  interestProgram: string
}

export default function Leads() {
  const location = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const leadService = new LeadService()

  const getLeads = async () => {
    const response = await leadService.list()
    if (response.code == 200) {
      setLeads(response.list)
    }
  }

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "purple",
      breadcrumb: [
        {
          title: "Leads",
          url: "/leads",
        },
      ],
    })

    getLeads()
  }, [])

  const filteredLeads = leads.filter(
    (lead) =>
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile_phone.includes(searchTerm),
  )

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-title text-purple-800">Leads</CardTitle>
          <Button onClick={() => location("/leads")} className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Lead
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex items-center text-muted-foreground my-4">
            <Info className="mr-2 h-5 w-5 text-center" />
            <p className="text-sm text-muted-foreground">Para editar un lead, haga click en el registro</p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Programa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow
                      key={lead._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => location(`/leads/${lead._id}`)}
                    >
                      <TableCell>{lead.full_name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.mobile_phone}</TableCell>
                      <TableCell>{lead.interestProgram}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

