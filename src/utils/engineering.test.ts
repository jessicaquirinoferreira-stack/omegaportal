import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTransformerDemand,
  validateQuoteForm,
  generateQuoteProtocol,
  STANDARD_TRANSFORMER_RATINGS_KVA
} from './engineering.ts';

test('calculateTransformerDemand correctly calculates apparent power and picks NBR standard transformer', () => {
  // 500 kW active power, fp 0.92, diversity 0.8, growth 20%
  // S = (500 * 0.8 * 1.20) / 0.92 = 480 / 0.92 = 521.739 kVA
  // Standard transformer should be 750 kVA
  const result = calculateTransformerDemand({
    activePowerKw: 500,
    powerFactor: 0.92,
    diversityFactor: 0.8,
    growthMarginPct: 20
  });

  assert.equal(Math.round(result.apparentPowerKva), 522);
  assert.equal(result.recommendedKva, 750);
  assert.ok(result.primaryCurrentAmps13_8kV > 30);
  assert.ok(result.substationType.includes('Cabine Primária'));
});

test('calculateTransformerDemand recommends high-voltage substation for massive loads', () => {
  const result = calculateTransformerDemand({
    activePowerKw: 12000,
    powerFactor: 0.95,
    diversityFactor: 0.9,
    growthMarginPct: 15
  });

  assert.ok(result.recommendedKva >= 10000);
  assert.ok(result.voltageClassRecommendation.includes('Alta Tensão'));
});

test('validateQuoteForm identifies missing fields and validates valid submission', () => {
  const invalidResult = validateQuoteForm({
    name: 'Jo',
    company: '',
    email: 'invalid-email',
    phone: '123',
    serviceType: ''
  });

  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.company);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.serviceType);

  const validResult = validateQuoteForm({
    name: 'Engenheiro Carlos Silva',
    company: 'Indústria Metalúrgica ABC Ltda',
    email: 'carlos.silva@industriaabc.com.br',
    phone: '(11) 98765-4321',
    serviceType: 'Cabines Primárias (15 a 34,5 kV)',
    powerKva: '2500 kVA'
  });

  assert.equal(validResult.isValid, true);
  assert.deepEqual(validResult.errors, {});
});

test('generateQuoteProtocol creates formatted protocol code', () => {
  const protocol = generateQuoteProtocol('OMG');
  assert.match(protocol, /^OMG-\d{4}-\d{6}$/);
});
