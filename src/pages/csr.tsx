import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  GraduationCap, 
  Home, 
  Shield, 
  HandHeart,
  BookOpen,
  Building,
  Stethoscope,
  Globe,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Briefcase,
  Baby
} from 'lucide-react';

const CSR: React.FC = () => {
  const { t } = useTranslation();
  const initiatives = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: t('pages.csr.education.title'),
      description: t('pages.csr.education.description'),
      impact: t('pages.csr.education.impact'),
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: t('pages.csr.healthcare.title'),
      description: t('pages.csr.healthcare.description'),
      impact: t('pages.csr.healthcare.impact'),
      color: 'bg-red-100 text-red-800'
    },
    {
      icon: <Baby className="h-6 w-6" />,
      title: t('pages.csr.childWelfare.title'),
      description: t('pages.csr.childWelfare.description'),
      impact: t('pages.csr.childWelfare.impact'),
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: t('pages.csr.infrastructure.title'),
      description: t('pages.csr.infrastructure.description'),
      impact: t('pages.csr.infrastructure.impact'),
      color: 'bg-green-100 text-green-800'
    }
  ];

  const stats = [
    { number: '200+', label: t('pages.csr.stats.artisanFamilies'), icon: <Users className="h-8 w-8" /> },
    { number: '15', label: t('pages.csr.stats.communities'), icon: <Globe className="h-8 w-8" /> },
    { number: '$500K+', label: t('pages.csr.stats.investment'), icon: <DollarSign className="h-8 w-8" /> },
    { number: '95%', label: t('pages.csr.stats.fairTrade'), icon: <Shield className="h-8 w-8" /> }
  ];

  const programs = [
    {
      title: t('pages.csr.flagshipPrograms.artisanEmpowerment.title'),
      description: t('pages.csr.flagshipPrograms.artisanEmpowerment.description'),
      beneficiaries: t('pages.csr.flagshipPrograms.artisanEmpowerment.beneficiaries'),
      established: t('pages.csr.flagshipPrograms.artisanEmpowerment.established'),
      features: [
        t('pages.csr.flagshipPrograms.artisanEmpowerment.features.fairWage'),
        t('pages.csr.flagshipPrograms.artisanEmpowerment.features.healthInsurance'),
        t('pages.csr.flagshipPrograms.artisanEmpowerment.features.skillsWorkshops'),
        t('pages.csr.flagshipPrograms.artisanEmpowerment.features.businessMentorship')
      ]
    },
    {
      title: t('pages.csr.flagshipPrograms.womensEmpowerment.title'),
      description: t('pages.csr.flagshipPrograms.womensEmpowerment.description'),
      beneficiaries: t('pages.csr.flagshipPrograms.womensEmpowerment.beneficiaries'),
      established: t('pages.csr.flagshipPrograms.womensEmpowerment.established'),
      features: [
        t('pages.csr.flagshipPrograms.womensEmpowerment.features.leadershipPrograms'),
        t('pages.csr.flagshipPrograms.womensEmpowerment.features.microfinanceAccess'),
        t('pages.csr.flagshipPrograms.womensEmpowerment.features.childcareSupport'),
        t('pages.csr.flagshipPrograms.womensEmpowerment.features.marketAccess')
      ]
    },
    {
      title: t('pages.csr.flagshipPrograms.youthDevelopment.title'),
      description: t('pages.csr.flagshipPrograms.youthDevelopment.description'),
      beneficiaries: t('pages.csr.flagshipPrograms.youthDevelopment.beneficiaries'),
      established: t('pages.csr.flagshipPrograms.youthDevelopment.established'),
      features: [
        t('pages.csr.flagshipPrograms.youthDevelopment.features.apprenticeshipPrograms'),
        t('pages.csr.flagshipPrograms.youthDevelopment.features.digitalLiteracy'),
        t('pages.csr.flagshipPrograms.youthDevelopment.features.entrepreneurshipWorkshops'),
        t('pages.csr.flagshipPrograms.youthDevelopment.features.culturalPreservation')
      ]
    }
  ];

  const partnerships = [
    {
      name: t('pages.csr.partnerships.localNgos.title'),
      description: t('pages.csr.partnerships.localNgos.description'),
      icon: <HandHeart className="h-6 w-6" />
    },
    {
      name: t('pages.csr.partnerships.educationalInstitutions.title'),
      description: t('pages.csr.partnerships.educationalInstitutions.description'),
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      name: t('pages.csr.partnerships.governmentAgencies.title'),
      description: t('pages.csr.partnerships.governmentAgencies.description'),
      icon: <Building className="h-6 w-6" />
    },
    {
      name: t('pages.csr.partnerships.internationalOrganizations.title'),
      description: t('pages.csr.partnerships.internationalOrganizations.description'),
      icon: <Globe className="h-6 w-6" />
    }
  ];

  const goals = [
    {
      year: '2025',
      target: t('pages.csr.goals.2025.title'),
      progress: t('pages.csr.goals.2025.progress'),
      status: t('pages.csr.goals.2025.status')
    },
    {
      year: '2026',
      target: t('pages.csr.goals.2026.title'),
      progress: t('pages.csr.goals.2026.progress'),
      status: t('pages.csr.goals.2026.status')
    },
    {
      year: '2027',
      target: t('pages.csr.goals.2027.title'),
      progress: t('pages.csr.goals.2027.progress'),
      status: t('pages.csr.goals.2027.status')
    }
  ];

  return (
    <AppLayout>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">{t('pages.csr.badge')}</span>
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">
            {t('pages.csr.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('pages.csr.subtitle')}
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 text-center bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-black mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Our Initiatives */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('pages.csr.socialImpact')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${initiative.color.replace('text-', 'bg-').replace('-800', '-100')} flex-shrink-0`}>
                      {initiative.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">{initiative.title}</h3>
                      <p className="text-gray-700 mb-3">{initiative.description}</p>
                      <Badge className={`${initiative.color} text-xs`}>
                        {initiative.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('pages.csr.flagshipProgramsTitle')}</h2>
          <div className="space-y-6">
            {programs.map((program, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-black">{program.title}</h3>
                        <Badge variant="outline" className="border-blue-600 text-blue-600">
                          Est. {program.established}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{program.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{program.beneficiaries}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            {index === 0 && t('pages.csr.flagshipPrograms.artisanEmpowerment.status')}
                            {index === 1 && t('pages.csr.flagshipPrograms.womensEmpowerment.status')}
                            {index === 2 && t('pages.csr.flagshipPrograms.youthDevelopment.status')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-black mb-3">
                        {index === 0 && t('pages.csr.flagshipPrograms.artisanEmpowerment.keyFeatures')}
                        {index === 1 && t('pages.csr.flagshipPrograms.womensEmpowerment.keyFeatures')}
                        {index === 2 && t('pages.csr.flagshipPrograms.youthDevelopment.keyFeatures')}
                      </h4>
                      <ul className="space-y-2">
                        {program.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnerships */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('pages.csr.strategicPartnerships')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <Card key={index} className="border-gray-200 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {partner.icon}
                  </div>
                  <h3 className="font-bold text-black mb-2">{partner.name}</h3>
                  <p className="text-gray-700 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fair Trade Commitment */}
        <Card className="border-gray-200 mb-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">{t('pages.csr.fairTrade')}</h2>
                <p className="text-gray-700 mb-4">
                  {t('pages.csr.fairTradeDesc')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{t('pages.csr.fairTradeDetails.wagesAboveMinimum')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{t('pages.csr.fairTradeDetails.healthcareCoverage')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{t('pages.csr.fairTradeDetails.safeWorkingConditions')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{t('pages.csr.fairTradeDetails.transparentPricing')}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-black mb-2">95%</div>
                  <p className="text-gray-700 mb-4">{t('pages.csr.fairTradeDetails.certifiedProducts')}</p>
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t('pages.csr.fairTradeDetails.verifiedSourcing')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSR Goals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('pages.csr.socialImpactGoals')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-black mb-1">{goal.year}</div>
                    <Badge variant="outline" className="border-blue-600 text-blue-600">
                      {goal.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-black text-lg mb-3">{goal.target}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{goal.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: goal.progress }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Story */}
        <Card className="border-gray-200 mb-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-black mb-4">{t('pages.csr.successStory.title')}</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                {t('pages.csr.successStory.description')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">25</div>
                <div className="text-sm text-gray-600">{t('pages.csr.successStory.womenEmployed')}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">$15K</div>
                <div className="text-sm text-gray-600">{t('pages.csr.successStory.incomeIncrease')}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-black mb-1">80+</div>
                <div className="text-sm text-gray-600">{t('pages.csr.successStory.familyMembers')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('pages.csr.partnerWithUs')}</h3>
            <p className="mb-6 max-w-2xl mx-auto opacity-90">
              {t('pages.csr.partnerDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                {t('pages.csr.supportMission')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('pages.csr.downloadReport')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
};

export default CSR;