import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StorageService } from '../../../service/storageService'; // Ajusta la ruta si es necesario

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Mínimo 3 caracteres').required('Nombre requerido'),
  email: Yup.string().email('Email inválido').required('Email requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Requerido'),
});

export default function RegisterScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  const fetchUsers = async () => {
    const savedUsers = await StorageService.load<any[]>('registered_users');
    setUsers(savedUsers || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (values: any, resetForm: () => void) => {
    try {
      const updatedUsers = [...users, values];
      await StorageService.save('registered_users', updatedUsers);
      setUsers(updatedUsers);
      resetForm();
      Alert.alert('Éxito', 'Usuario guardado localmente');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el usuario');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Formulario de Registro 🚀</Text>

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { resetForm }) => handleRegister(values, resetForm)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              placeholder="Correo electrónico"
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              placeholder="Confirmar contraseña"
              style={styles.input}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <Button title="Registrar" onPress={handleSubmit as any} color="#800080" />
          </>
        )}
      </Formik>

      <TouchableOpacity
        onPress={() => setShowUsers(!showUsers)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>
          {showUsers ? 'Ocultar usuarios registrados 👥' : 'Ver usuarios registrados 👁️'}
        </Text>
      </TouchableOpacity>

      {showUsers && users.length > 0 && (
        <View style={styles.userList}>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ))}
        </View>
      )}

      {showUsers && users.length === 0 && (
        <Text style={styles.noUsers}>No hay usuarios registrados</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#800080',
    fontWeight: 'bold',
  },
  userList: {
    marginTop: 16,
  },
  userCard: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#555',
  },
  noUsers: {
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
  },
});
