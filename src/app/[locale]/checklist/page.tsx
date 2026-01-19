import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChecklistForm from '@/components/checklist/ChecklistForm'

export default function ChecklistPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ChecklistForm />
      <Footer />
    </main>
  )
}

